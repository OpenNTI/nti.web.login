#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function, unicode_literals, absolute_import, division
__docformat__ = "restructuredtext en" #TODO: do we need this?

from babel.dates import format_timedelta
import datetime
from dateutil import parser
from isodate import parse_duration
import json
import re # regular expressions
import requests
from slugify import slugify_url
import sys

#	This script takes command line arguments for URL, username,
#	and password, and outputs a json file formatted for the
#	template that generates platform landing pages (currently
#	just for Janux). 


def get_catalog_entries (URL, username, password):
	response = requests.get(URL, auth=(username, password))
	return response.json()


def is_displayable_course (course):

	valid_enrollment_types = ['OpenEnrollment', 'StoreEnrollment',
								'FiveminuteEnrollment']

	if course['is_non_public'] == True:
		return False

	for enrollment_type in course['EnrollmentOptions']['Items']:
		if enrollment_type in valid_enrollment_types:
			if course['EnrollmentOptions']['Items'][enrollment_type]['IsAvailable']:
				return True
	return False


def get_kaltura_id (id):

	if id is None:
		return ""

	p = re.compile(r'kaltura://\d*/')
	q = re.compile(r'/')
	id_matched = p.split(id)
	if len(id_matched) > 1: # Our RE matched the ID
		kaltura_id = q.split(id_matched[1]) # get rid of slash at the end
		return kaltura_id[0] 
	else:
		return ''


def get_duration (duration_string):
	if duration_string is None:
		return ''
	d_delta = parse_duration(duration_string)
	duration_string = format_timedelta(d_delta, threshold=36, granularity='week')
	return duration_string


def get_instructors_list (instructor_array):
	result = []

	for instructor in instructor_array:
		if not instructor['JobTitle'].find('Teaching Assistant') > -1:
			result.append(instructor)

	return result


def get_course_instructor_title (instructor_array):

	# handle cases where there are only one or two instructors
	if len(instructor_array) == 1:
		return instructor_array[0]['Name']
	if len(instructor_array) == 2:
		return instructor_array[0]['Name'] + ' & ' + instructor_array[1]['Name']

	# otherwise, add commas as appropriate
	result = ''
	for i in range (len(instructor_array)-1):
		result += (instructor_array[i]['Name'] + ', ')
	
	return result + '& ' + instructor_array[-1]['Name']
	

def transform_course (course):
	"""
	Transforms a course from the course catalog into the format
	used by the JSON file feeding the Janux landing page.
	"""
	result = {}
	result['credit'] = course['Credit']
	result['duration'] = get_duration(course['Duration'])
	result['duration_code'] = course['Duration']
	result['detailAnchor'] = slugify_url(course['NTIID'])
	result['description'] = course['Description']
	result['instructors'] = get_instructors_list(course['Instructors'])
	result['instructor'] = get_course_instructor_title(result['instructors'])
	result['kalturaVideo'] = get_kaltura_id(course['Video'])
	result['name'] = course['ProviderUniqueID']
	result['prerequisites'] = course['Prerequisites']
	result['schedule'] = course['Schedule']
	result['school'] = course['ProviderDepartmentTitle']
	result['startDate'] = course['StartDate']
	result['endDate'] = course['EndDate']
	result['title'] = course['Title']
	if course['AdditionalProperties']:
		if 'Marketing' in course['AdditionalProperties']:
			if 'URL' in course['AdditionalProperties']['Marketing']:
				result['url'] = course['AdditionalProperties']['Marketing']['URL']

	return result


command_line_params = sys.argv
URL = command_line_params [1]
username = command_line_params [2]
password = command_line_params [3]

all_catalog_entries = get_catalog_entries(URL, username, password)
marketing_course_urls = {}
displayable_courses = []

archived_courses = []
current_courses = []
upcoming_courses = []

# Filter courses so that displayable_courses 
# contains only courses we want to display
for course in all_catalog_entries['Items']:

	if course['AdditionalProperties']:
		if 'Marketing' in course['AdditionalProperties']:
			if 'URL' in course['AdditionalProperties']['Marketing']:
				url = course['AdditionalProperties']['Marketing']['URL']
				marketing_course_urls[url] = course
	elif is_displayable_course(course):
		displayable_courses.append(course)

current_date = datetime.date.today() # or something like that

for course in marketing_course_urls:
	transformed_course = transform_course(marketing_course_urls[course])
	upcoming_courses.append(transformed_course)
	
for course in displayable_courses:
	course = transform_course(course)
	course_start_date = parser.parse(course['startDate']).date()
	course_end_date = parser.parse(course['endDate']).date()

	if current_date > course_end_date:
		archived_courses.append(course)

	elif course_start_date > current_date:
		upcoming_courses.append(course)

	else:
		current_courses.append(course)

data = {}
data['archivedCoursesLabel'] = 'Archived'
data['archivedCourses'] = archived_courses
data['currentCoursesLabel'] = 'Current - Spring'
data['currentCourses'] = current_courses
data['upcomingCoursesLabel'] = 'Upcoming'
data['upcomingCourses'] = upcoming_courses

# Write output file
with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
		


