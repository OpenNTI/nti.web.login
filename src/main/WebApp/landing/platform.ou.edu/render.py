#!/usr/bin/env python

import os
import jinja2
import json 

data = json.load(open('data.json'))

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


def write_index(contents):
	outfile = "index.html"
	with open( outfile, 'wb' ) as file:
		file.write(contents)


def main():
	template = jinja_environment.get_template('index.tpl')	
	write_index(template.render(data))
	
if __name__ == '__main__':
        main()