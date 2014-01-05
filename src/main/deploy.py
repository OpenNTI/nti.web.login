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

	analytics_domain = 'nextthought.com'
	if ',' in analytics_key:
		analytics_key, analytics_domain = analytics_key.split(',')

	analytics = """
<script type="text/javascript">
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', '%s', '%s');
ga('send', 'pageview');
</script>
""" % (analytics_key, analytics_domain)

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
	# doesn't exist, then write our copy...but only do this if the destination
	# is not a symlink, because in dev environments it tends to be
	# a symlink to the .in file itself
	if not os.path.isfile(outfile) or os.stat(html_file).st_mtime >= os.stat(outfile).st_mtime:
		if not os.path.islink(outfile):
			with open( outfile, 'wb' ) as f:
				f.write(contents)


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('-a', '--google-analytics', dest='analytics_key', action='store', default=None, help="Key value used with Google Analytics.	 If no value is specified, then the index-minify.html will not contain Google Analytics code.")

	args = parser.parse_args()

	_updateHtml('WebApp/index.html.in',args.analytics_key)
	_updateHtml('WebApp/mobile.html.in',args.analytics_key)
	_updateHtml('WebApp/passwordrecover.html.in',args.analytics_key)
	_updateHtml('WebApp/signup.html.in',args.analytics_key)
	_updateHtml('WebApp/unsupported.html.in',args.analytics_key)
	_updateHtml('WebApp/landing/platform.ou.edu/index.html',args.analytics_key)

if __name__ == '__main__':
		main()
