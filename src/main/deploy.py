#!/usr/bin/env python
# either, make a phantomjs script that reads all the dependencies using ExtJS's class loader...
# Or... read each js file and parse the requires dependency tree and order the files our selves...
# then, use that list to read our files into Google Closure compiler to minify our code.
from __future__ import print_function, unicode_literals

import argparse
import httplib
import json
import os
import subprocess
import sys
import time
import urllib2 as urllib

BUILDTIME = time.strftime('%Y%m%d%H%M%S')

def _updateHtml( html_file, analytics_key ):
	contents = ''
	with open( html_file, 'rb' ) as file:
		contents = file.read()

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
	outfile = _t[0] + '-mod' + _t[1]
	with open( outfile, 'wb' ) as file:
		file.write(contents)

def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('-a', '--google-analytics', dest='analytics_key', action='store', default=None, help="Key value used with Google Analytics.  If no value is specified, then the index-minify.html will not contain Google Analytics code.")

	args = parser.parse_args()

	_updateHtml('WebApp/index.html',args.analytics_key)
	_updateHtml('WebApp/signup.html',args.analytics_key)

if __name__ == '__main__':
        main()
