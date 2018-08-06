export const getNationalityList = (req, res) => {
    res.json([
      {
        id: '000000001',
        code: '001',
        cname: '中国',
      },
      {
        id: '000000002',
        code: '002',
        cname: '美国',
      },
      
    ]);
  };
  export default {
    getNationalityList,
  };
  