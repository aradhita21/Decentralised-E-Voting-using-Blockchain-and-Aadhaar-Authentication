// stop erase animations from firing on load
document.addEventListener("DOMContentLoaded",function() {
	var q = document.querySelectorAll(".cb");
	for (var i in q) {
		if (+i < q.length) {
			q[i].addEventListener("click",function(){
				let c = this.classList,
					p = "pristine";
				if (c.contains(p)) {
					c.remove(p);
				}
			});
		}
	}
	
});

$(document).ready(function() {
	$('.modal').modal();
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
		}
	
		var aadhaar_list = {
			"300000000000" : "Aradhita",
			"738253790005" : "Bhandara"
		}
	
		var aadhaar = readCookie('aadhaar');
	
		console.log(aadhaar);
		var address = aadhaar_list[aadhaar];
		console.log(address);
		$('#loc_info').text('Location based on Aadhaar : '+ address)
	

})