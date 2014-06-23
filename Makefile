DIR=./src/main/WebApp/landing/platform.ou.edu

all: render

render: $(DIR)/index.html courses

#clean: cleanindex cleancourses
#	mv $(DIR)/about.html $(DIR)/about.html.keep
# 	rm -f $(DIR)/*.html
# 	mv $(DIR)/about.html.keep $(DIR)/about.html

#cleanindex:
#	rm -f $(DIR)/index.html

#cleancourses:
#	rm -f $(DIR)/course*.html

$(DIR)/index.html: $(DIR)/data.json $(DIR)/index.pt
	$(NTI_BIN)nti_zpt_render --data $(DIR)/data.json $(DIR)/index.pt $(DIR)/index.html

courses: $(DIR)/courses.time

$(DIR)/courses.time: $(DIR)/data.json $(DIR)/course_details.pt
	$(NTI_BIN)nti_zpt_render --data $(DIR)/data.json --repeat-on currentCourses --repeat-on-name course --repeat-filename-specific-path id $(DIR)/course_details.pt $(DIR)/course.html
	$(NTI_BIN)nti_zpt_render --data $(DIR)/data.json --repeat-on upcomingCourses --repeat-on-name course --repeat-filename-specific-path id $(DIR)/course_details.pt $(DIR)/course.html
	$(NTI_BIN)nti_zpt_render --data $(DIR)/data.json --repeat-on archivedCourses --repeat-on-name course --repeat-filename-specific-path id $(DIR)/course_details.pt $(DIR)/course.html
	@ touch $(DIR)/courses.time
