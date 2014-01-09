#!/usr/bin/env python
# either, make a phantomjs script that reads all the dependencies using ExtJS's class loader...
# Or... read each js file and parse the requires dependency tree and order the files our selves...
# then, use that list to read our files into Google Closure compiler to minify our code.
from __future__ import print_function, unicode_literals

import argparse
import os
import time

import glob
import itertools

BUILDTIME = time.strftime('%Y%m%d%H%M%S')

def _updateHtml( html_file, analytics_key, dep_mod_time ):
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
	outfile_mod_time = -1 if not os.path.isfile(outfile) else os.stat(outfile).st_mtime
	dep_mod_time = max(os.stat(html_file).st_mtime, dep_mod_time)
	if dep_mod_time >= outfile_mod_time:
		if not os.path.islink(outfile):
			with open( outfile, 'wb' ) as f:
				f.write(contents)


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('-a', '--google-analytics', dest='analytics_key', action='store', default='', help="Key value used with Google Analytics.	 If no value is specified, then the index-minify.html will not contain Google Analytics code.")

	args = parser.parse_args()

	# Find the most recent modification date of our dependencies.
	# If our output files are older than that, we rebuild
	# even if the templated didn't change
	dep_mod_date = 0
	for path in itertools.chain(glob.iglob('WebApp/js/*.js'),
								glob.iglob('WebApp/resources/css/*.css')):
		dep_mod_date = max(dep_mod_date,
						   os.stat(path).st_mtime)

	_updateHtml('WebApp/index.html.in',args.analytics_key, dep_mod_date)
	_updateHtml('WebApp/mobile.html.in',args.analytics_key, dep_mod_date)
	_updateHtml('WebApp/passwordrecover.html.in',args.analytics_key, dep_mod_date)
	_updateHtml('WebApp/signup.html.in',args.analytics_key, dep_mod_date)
	_updateHtml('WebApp/unsupported.html.in',args.analytics_key, dep_mod_date)
	_updateHtml('WebApp/landing/platform.ou.edu/index.html',args.analytics_key, dep_mod_date)

if __name__ == '__main__':
		main()
