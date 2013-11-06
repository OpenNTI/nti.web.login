DIR=./src/main/WebApp/landing/platform.ou.edu

all: render

render: clean index.html courses
	
clean: cleanindex cleancourses
#	mv $(DIR)/about.html $(DIR)/about.html.keep
# 	rm -f $(DIR)/*.html
# 	mv $(DIR)/about.html.keep $(DIR)/about.html

cleanindex:
	rm -f $(DIR)/index.html
	
cleancourses:
	rm -f $(DIR)/course*.html
	
index.html: cleanindex
	$(NTI_BIN)nti_zpt_render --data $(DIR)/data.json $(DIR)/index.pt $(DIR)/index.html

courses: cleancourses
	$(NTI_BIN)nti_zpt_render --data $(DIR)/data.json --repeat-on upcomingCourses --repeat-on-name course --repeat-filename-specific-path id $(DIR)/course_details.pt $(DIR)/course.html