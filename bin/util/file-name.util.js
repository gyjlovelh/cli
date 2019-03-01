
/**
 * _-[A-Z] toCamel
 * 
 * @param {string} str 
 */
function anyToCamel(str) {
    return underlineToCamel(('_' + str).replace(/\-+/g, '_'));
}

/**
 * 下划线转驼峰
 * 
 * @param {string} str 
 */
function underlineToCamel(str) {
    return str.replace(/\_+(\w)/g, (all, letter) => letter.toUpperCase());    
}

/**
 * 驼峰转下划线
 * 
 * @param {string} str 
 */
function camelToUnderline(str) {
    let temp = str.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase());
  	if(temp.slice(0,1) === '_'){ //如果首字母是大写，执行replace时会多一个_，这里需要去掉
  		temp = temp.slice(1);
  	}
	return temp;
}

/**
 * 驼峰转小横线
 * 
 * @param {string} str 
 */
function camelToLetter(str) {
    let temp = str.replace(/[A-Z]/g, function (match) {	
		return "-" + match.toLowerCase();
  	});
  	if(temp.slice(0, 1) === '-'){ //如果首字母是大写，执行replace时会多一个-，这里需要去掉
  		temp = temp.slice(1);
  	}
	return temp;
}


module.exports = {
    underlineToCamel,
    camelToUnderline,
    camelToLetter,
    anyToCamel
};
