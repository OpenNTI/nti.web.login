#!/usr/bin/env python
# either, make a phantomjs script that reads all the dependencies using ExtJS's class loader...
# Or... read each js file and parse the requires dependency tree and order the files our selves...
# then, use that list to read our files into Google Closure compiler to minify our code.
from __future__ import print_function, unicode_literals

import argparse
import os
import time

BUILDTIME = time.strftime('%Y%m%d%H%M%S')

def _updateHtml( html_file, analytics_key ):
	with open( html_file, 'rb' ) as f:
		contents = f.read()

	analytics = """
        <script type="text/javascript">
	        var _gaq = _gaq || [];
                _gaq.push(['_setAccount', '%s']);
                _gaq.push(['_setDomainName', 'nextthought.com']);
                _gaq.push(['_trackPageview']);
                (function() {
	                var ga = document.createElement('script');
                        ga.type = 'text/javascript';
                        ga.async = true;
                        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') +
                                '.google-analytics.com/ga.js';
                        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
                })();
        </script>
""" % (analytics_key, )

	contents = contents.replace('%time%', BUILDTIME)
	if analytics_key:
		contents = contents.replace('<!--[analytics code here]-->', analytics)
	else:
		contents = contents.replace('<!--[analytics code here]-->', '')

	_t = os.path.splitext(html_file)
	# Drop the trailing .in suffix if it exists. For all
	# template files checked in, it must exist; for generated
	# files, it must not.
	outfile = html_file[:-3] if html_file.endswith('.in') else html_file

	# If the original file is at least as new as our copy (at least because
	# it may be the same file), or our copy
	# doesn't exist, then write our copy
	if not os.path.isfile(outfile) or os.stat(html_file).st_mtime >= os.stat(outfile).st_mtime:

		with open( outfile, 'wb' ) as f:
			f.write(contents)


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('-a', '--google-analytics', dest='analytics_key', action='store', default=None, help="Key value used with Google Analytics.  If no value is specified, then the index-minify.html will not contain Google Analytics code.")

	args = parser.parse_args()

	_updateHtml('WebApp/index.html.in',args.analytics_key)
	_updateHtml('WebApp/mobile.html.in',args.analytics_key)
	_updateHtml('WebApp/passwordrecover.html.in',args.analytics_key)
	_updateHtml('WebApp/signup.html.in',args.analytics_key)
	_updateHtml('WebApp/unsupported.html.in',args.analytics_key)
	_updateHtml('WebApp/landing/platform.ou.edu/index.html',args.analytics_key)

if __name__ == '__main__':
        main()
