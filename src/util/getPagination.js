
export  const getPagination = (collection,  {
  page = 1, 
  pageSize 
}) => {

  const pageCount = Math.ceil(collection?.length / pageSize);
  const startNum = (page - 1) * pageSize;  
  const visible = collection?.slice(startNum, startNum + pageSize);



  return {
    startNum,
    pageCount,
    visible
  }

  
}