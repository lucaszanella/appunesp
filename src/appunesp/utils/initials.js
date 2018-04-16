export default initials = name => {
    x = name.split(" ", 2);
    if (x.length>=2)
      return x[0][0]+x[1][0]
    else if (x.length==1)
      return x[0][0]
    else 
      return "XX";
}