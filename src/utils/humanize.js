function humanize (word){
	if(!word) return word;
	var t = "" + word.toString().replace(/_/g, ' ');
    t = t.charAt(0).toUpperCase() + t.slice(1);
    return t;
}

module.exports = humanize;
