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

import gzip

BUILDTIME = time.strftime('%Y%m%d%H%M%S')

def _updateHtml( html_file, analytics_key, itunes_id, dep_mod_time ):
	with open( html_file, 'rb' ) as f:
		contents = f.read()
		# bytes to unicode string
		contents = contents.decode('utf-8')

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

	if itunes_id:
		contents = contents.replace( '<!--[itunes banner here]-->',
									 '<meta name="apple-itunes-app" content="app-id=%s" />' % itunes_id)
	else:
		contents = contents.replace( '<!--[itunes banner here]-->', '' )

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
		# unicode string back to bytes
		contents = contents.encode("utf-8")
		if not os.path.islink(outfile):
			with open( outfile, 'wb' ) as f:
				f.write(contents)
			# Write a .gz version for nginx http://nginx.org/en/docs/http/ngx_http_gzip_static_module.html
			out_time = os.stat(outfile).st_mtime
			with open( outfile + '.gz', 'wb' ) as f:
				gf = gzip.GzipFile( outfile, 'wb', 9, f, out_time)
				gf.write(contents)
				gf.close()
			os.utime(outfile + '.gz', (out_time, out_time))

def gzip_files(file_paths):
	"Compress files that are known to exist"
	# Write a .gz version for nginx http://nginx.org/en/docs/http/ngx_http_gzip_static_module.html
	for path in file_paths:
		gz_path = path + '.gz'
		path_mod_time = os.stat(path).st_mtime
		if not os.path.isfile(gz_path) or os.stat(gz_path).st_mtime < path_mod_time:
			with open(path, 'rb') as f:
				contents = f.read()
			with open( gz_path, 'wb' ) as f:
				gf = gzip.GzipFile( path, 'wb', 9, f, path_mod_time)
				gf.write(contents)
				gf.close()
			os.utime(gz_path, (path_mod_time, path_mod_time))



def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('-a', '--google-analytics', dest='analytics_key', action='store', default='', help="Key value used with Google Analytics.	 If no value is specified, then the index-minify.html will not contain Google Analytics code.")
	parser.add_argument('--itunes', dest='itunes', action='store', default=None, help="The iTunes AppID to advertise")
	args = parser.parse_args()

	# Find the most recent modification date of our dependencies.
	# If our output files are older than that, we rebuild
	# even if the templated didn't change
	dep_mod_date = 0
	for path in itertools.chain(glob.iglob('WebApp/js/*.js'),
								glob.iglob('WebApp/resources/css/*.css')):
		dep_mod_date = max(dep_mod_date,
						   os.stat(path).st_mtime)

	for path in itertools.chain(glob.iglob('WebApp/*.html.in'),
								glob.iglob('WebApp/lang/*/*.html.in')):
		_updateHtml(path,args.analytics_key, args.itunes, dep_mod_date)


	gzip_files(glob.iglob('WebApp/js/*.js'))
	gzip_files(glob.iglob('WebApp/resources/css/*.css'))
	gzip_files(glob.iglob('WebApp/resources/fonts/*.css'))
	# TTFs compress well, most other font formats do not
	gzip_files(glob.iglob('WebApp/resources/fonts/*/*.ttf'))

if __name__ == '__main__':
		main()
