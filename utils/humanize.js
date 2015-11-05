function humanize (word){
	if(!word) return word;
	var t = "" + word.toString().replace(/_/g, ' ');
    t = t.charAt(0).toUpperCase() + t.slice(1);
    return t;
}

function formatSizeUnits(bytes){
	if      (bytes>=1000000000000) {bytes=(bytes/1000000000000).toFixed(0)+' T';}
	else if (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(0)+' G';}
    else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(0)+' M';}
    else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(0)+' K';}
    else if (bytes>1)           {bytes=bytes+' ';}
    else if (bytes==1)          {bytes=bytes+' ';}
    else                        {bytes='0 ';}
    return bytes;
}

humanize.formatSizeUnits = formatSizeUnits;
module.exports = humanize;
