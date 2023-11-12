import test from 'ava';
const rewire = require("rewire");
const mockServer = rewire('../../server/middleware/mockServer.js');
const matchApi = mockServer.__get__('matchApi');


test('matchApi', t => {
  const apiRule = '/yapi/user/:username';
  t.truthy(matchApi('/yapi/user/tom', apiRule));
  t.truthy(matchApi('/yapi/user/111$$%#$##$#2222222222!!!!!!!', apiRule))
  t.false(matchApi('/yapi/user/a/', apiRule))
  t.false(matchApi('/yapi/use/a', apiRule))
  
  const apiRule_2 = '/yapi/user/:username/kk';
  t.truthy(matchApi('/yapi/user/aa/kk', apiRule_2));
  t.truthy(matchApi('/yapi/user/!!!###kksdjfks***/kk', apiRule_2));
  t.false(matchApi('/yapi/user/aa/aa', apiRule_2));

  const apiRule_3 = '/yapi/user/:sdfsdfj/ttt/:sdkfjkj';
  t.truthy(matchApi('/yapi/user/a/ttt/b', apiRule_3));
  t.false(matchApi('/yapi/user/a/ttt2/b', apiRule_3))

  const apiRule_4 = '/yapi/user/{aaa}/ttt/{bbbb}';
  t.truthy(matchApi('/yapi/user/a/ttt/b', apiRule_4));
  t.false(matchApi('/yapi/user/a/ttt2/b', apiRule_4))

  const apiRule_5 = '/yapi/user/{aaa}/ttt/{bbbb}';
  let r5 = matchApi('/yapi/user/ac/ttt/bd', apiRule_5);
  t.deepEqual(r5, {
    aaa: 'ac', 
    bbbb: 'bd',
    __weight: 2
  });

  const apiRule_6 = '/yapi/user/a1={aaa}/ttt/b1={bbbb}';
  let r6 = matchApi('/yapi/user/a1=aaa/ttt/b1=111q', apiRule_6);
  t.deepEqual(r6, {
    aaa: 'aaa', 
    bbbb: '111q',
    __weight: 2
  });


  const apiRule_7 = '/yapi/user/a1={aaa}/ttt/b1={bbbb}/xxx/yyy';
  let r7 = matchApi('/yapi/user/a1=aaa/ttt/b1=111q/xxx/yyy', apiRule_7);
  t.deepEqual(r7, {
    aaa: 'aaa', 
    bbbb: '111q',
    __weight: 4
  });

});
