pfeApp.factory('serviceGeneral', function() {
	var responce = {};
	return {
		isInt: function(n) {
			return (typeof n === 'number' && n % 1 == 0);
		},
		verifEmail: function(email) {
			var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (email && email.length > 0 && reg.test(email)) {
				return true;
			} else {
				return false;
			}
		},
		verifName: function(name) {
			var reg = /^[a-zA-Z0-9 àâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ]{5,32}$/;
			if (name && name.length > 0 && reg.test(name)) {
				return true;
			} else {
				return false;
			}
		},
		verifLogin: function(login) {
			var reg = /^[a-zA-Z0-9]{4,32}$/;
			if (login && login.length > 0 && reg.test(login)) {
				return true;
			} else {
				return false;
			}
		},
		verifPassword: function(password) {
			var reg = /^[a-zA-Z0-9]{8,32}$/;
			if (password && password.length > 0 && reg.test(password)) {
				return true;
			} else {
				return false;
			}
		}
	}
})