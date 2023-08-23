import isEmpty from 'lodash/isEmpty';

const hasNoShareData = (share) => !share || !share.data || isEmpty(share.data);

export default hasNoShareData;
