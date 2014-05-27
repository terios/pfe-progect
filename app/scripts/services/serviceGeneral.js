pfeApp.factory('serviceGeneral',function(){
	var responce={};
	return{
		isInt:function(n){
			   return (typeof n === 'number' && n % 1 == 0);
		}
	}
})