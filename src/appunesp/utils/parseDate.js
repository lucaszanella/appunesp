dateRegex = /(\d{4})-(\d+)-(\d+)\s(\d+):(\d+):(\d+)/;
const date = new Date();

export default parseDate = dateString => {
    x = dateRegex.exec(dateString);
    
    if (date.getFullYear() != parseInt(x[1]))
        return x[2] + "/" + x[1]; 
    
    return x[3] + "/" + x[2];
}