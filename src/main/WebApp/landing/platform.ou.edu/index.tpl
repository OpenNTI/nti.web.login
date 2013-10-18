<!DOCTYPE html>
<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> -->
<!-- <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> -->
<html lang="en">
<head>
	<script type="text/javascript"><!--
	//document.write('<base href="'+location.protocol+'//'+location.host+'/login/landing/platform.ou.edu/" />');
	//-->
	</script>
	<title>The University of Oklahoma</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="description" content="OU Landing">
	<meta name="author" content="NextThought">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" href="favicon.ico">
	<link rel="stylesheet" type="text/css" href="../../resources/fonts/fonts.css">
	<script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js"></script>
	<script type="text/javascript"><!--
	//WebFont.load({google: {families: ['Open Sans','Open Sans Condensed:300,700']}}); //-->
	</script>
	
	<!-- This is the stylesheet is OU specific style -->
	<link rel="stylesheet" type="text/css" href="ou-style.css" />
    <!-- This is the stylesheet that makes the footer stick. -->
	<link rel="stylesheet" type="text/css" href="stickyfooter-style.css" />
	<!-- This conditional is for IE8 and IE6 and earlier- 8 needs that display:table -->
	<!--[if !IE 7]>
	<style type="text/css">
		#wrap {display:table;height:100%}
	</style>
	<![endif]-->
	<link rel="stylesheet" type="text/css" href="main.css" />
</head>

<body>
<div id="wrapper-all"><div class="wrapper" id="container">
    <div class="globalheader">
     <div class="wrapper">
        <ul>
            <li><a class="tip home" href="http://www.ou.edu/web.html" alt="OU Home link"><span>OU Homepage</span></a></li>
            <li><a class="tip search" href="http://www.ou.edu/content/ousearch.html" alt="OU Search link"><span>Search OU</span></a></li>
            <li><a class="tip social" href="http://www.ou.edu/web/socialmediadirectory.html" alt="OU Social Media link"><span>OU Social Media</span></a></li>
            <li class="wordmark">The University of Oklahoma</li>
        </ul>
        <div style="clear:both;"></div>
      </div>
    </div>

    <div id="header">
        <div class="wrapper">
			<div class="code">
				<ul class="quick-links">
					<li><a class="ou-btn" href="/login/">Log In or Create an Account</a></li>
				</ul> 
			</div>
	        <a class="logo" href="#"><img src="images/ou_janux_logo.png" /></a>
        </div>
    </div>

	<div id="main">
    	<div class="wrapper">
			{# note: This is a Jinja2 template. It needs to be rendered. See: <a href="http://jinja.pocoo.org/docs/">Docs</a>  #}
			<div class="mast"><img id="feature-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Image of NextThought Interface" title="NextThought" width="1024" height="391">
				<div id="video">
					<iframe width="455" height="261" src="//www.youtube.com/embed/1pPxExNSRtM?rel=0&html5=1&hd=1&showinfo=0&modestbranding=1&origin=platform.ou.edu" frameborder="0" allowfullscreen></iframe>
				</div>
				
			</div>
			<div class="columns three">
				
				<div>
					<h3>Learn together</h3>
					<div>Connect, collaborate, and discuss the course through shared notes, live chats, and interactive whiteboards.</div>
				</div>
				
				<div>
					<h3>Open to anyone, anywhere</h3>
					<div>Interact with actual OU course content as we provide the best possible educational experience to all who wish to learn.</div>
				</div>
				
				<div>
					<h3>Seeded in tradition</h3>
					<div>Courses are taught by top faculty at the University of Oklahoma, a top tier research institution in America&#39;s heartland, committed to the best possible educational experience.</div>
				</div>
			</div>
			
			
			<div class="content gradient-bg">
				<h1>Available Courses <span>({{availableCoursesWhen}})</span></h1>
				<div class="grid">
					{% for course in availableCourses %}					  
  					<div class="grid-item" id="{{course.id}}">	
  						<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Course Image" 
							title="" style="background: #DDD url('images/courses/{{course.id}}.png') no-repeat center center;">
  						<div class="meta">
  							<div class="course-code">{{course.name}}</div>
  							<div class="course-name">{{course.title}}</div>
  							<div class="course-prof">By {{course.instructor}}</div>
  						</div>
  					</div>
					{% endfor %}
				</div>
				
				
				<h1>Upcoming Courses <span>({{upcomingCoursesWhen}})</span></h1>
				<div class="grid">
					{% for course in upcomingCourses %}					  
  					<div class="grid-item" id="{{course.id}}">	
  						<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Course Image" 
							title="" style="background: #DDD url('images/courses/{{course.id}}.png') no-repeat center center;">
  						<div class="meta">
  							<div class="course-code">{{course.name}}</div>
  							<div class="course-name">{{course.title}}</div>
  							<div class="course-prof">By {{course.instructor}}</div>
  						</div>
  					</div>
					{% endfor %}
				</div>
				
				
			</div>
			
			
			
			
			<div class="content tech">
				<h1>Tech Support</h1>
				<ul>
					<li>Call (405) 325-HELP</li>
					<li><a href="#">Submit Request</a></li>
					<li><a href="mailto:platformhelp@ou.edu">platformhelp@ou.edu</a></li>
					<li><a href="#">Service Centers</a></li>
				</ul>
			</div>
			
			
    	</div>
	</div>
</div> <!-- close #container -->
</div> <!-- close #wrapper-all -->

<div id="footer">
    <div class="wrapper">
    
        <div class="footerColumn logo">
            <img alt="OU" src="images/footerlogo.png">
        </div>
        <div class="footerColumn address">                  
            <a href="http://www.ou.edu/">The University of Oklahoma</a><br/>
            660 Parrington Oval,<br/>
            Norman, OK 73019-0390<br/>
            (405) 325-0311 
        </div>
        <div class="footerColumn links">
            <ul>
                <li><a href="http://www.ou.edu/publicaffairs/WebPolicies/accessstatement.html">Accessibility</a></li>
                <li><a href="http://www.ou.edu/green/">Sustainability</a></li>
                <li><a href="http://ouhsc.edu/hipaa/">HIPPA</a></li>
                <li><a href="http://www.hr.ou.edu/employment/">OU Job Search</a></li>
            </ul>
        </div>
        <div class="footerColumn links">
            <ul>
                <li><a href="http://www.hr.ou.edu/web/landing/policy.html">Policies</a></li>
                <li><a href="http://www.hr.ou.edu/web/landing/legalnotices.html">Legal Notices</a></li>
                <li><a href="http://www.ou.edu/content/publicaffairs/WebPolicies/copyright.html">Copyright</a></li>
            </ul>
        </div>
        <!-- <div class="footerColumn social">
            <h3>Social Links</h3>
            <ul>
                <li><a href="http://www.facebook.com/#" class="facebook">facebook</a></li>
                <li><a href="http://www.twitter.com/#" class="twitter">twitter</a></li>
                <li><a href="http://www.youtube.com/#" class="youtube">youtube</a></li>
                <li><a href="http://www.ou.edu/web/socialmediadirectory.html" class="more">more</a></li>
            </ul>
        </div> -->
        <div class="notes">
            Updated 08/19/2013 by The University of Oklahoma: <a href="mailto:platformhelp@ou.edu">platformhelp@ou.edu</a>
        </div>
    </div>
</div>
<!--[analytics code here]-->
</body>
</html>
