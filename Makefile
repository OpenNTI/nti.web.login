DIR=./src/main/WebApp/landing/platform.ou.edu

render: clean
	$(NTI_BIN)nti_zpt_render --data $(DIR)/data.json $(DIR)/index.pt $(DIR)/index.html
	
clean:
	rm -f $(DIR)/index.html