.branding {
	width: 860px;
	padding-left: 530px;
	border-radius: 5px;
	background: url("login_promo.jpg") -30px center no-repeat;
	box-shadow: 0 2px 7px 0 rgba(0,0,0,0.35);
}

body.signin {
  background: #f4f4f4 url("background.png");
}

.signin .middle.main {
	width: 860px;
}
#account-creation {
	border-radius: 0 0 3px 0;
}
.signin .container.main {
	border-radius: 0 3px 3px 0;
	box-shadow: -4px 0 5px -3px rgba(0,0,0,0.3);
}

.signin .forgot {
	margin-left: 530px;
}



#active-session-login.visible {
	padding-bottom: 180px;
}

body.signup .callout{
	display: block;
}
