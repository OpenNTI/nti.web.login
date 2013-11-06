DIR=./src/main/WebApp/landing/platform.ou.edu

render: clean
	$(NTI_BIN)nti_zpt_render --data $(DIR)/data.json $(DIR)/index.pt $(DIR)/index.html
	$(NTI_BIN)nti_zpt_render --data $(DIR)/data.json --repeat-on upcomingCourses --repeat-on-name course --repeat-filename-specific-path id $(DIR)/course_details.pt $(DIR)/course.html
	
clean:
	mv $(DIR)/about.html $(DIR)/about.html.keep
	rm -f $(DIR)/*.html
	mv $(DIR)/about.html.keep $(DIR)/about.html