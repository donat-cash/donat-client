import Loadable from 'react-loadable';

import loading from './Loading';

export default (loader) => Loadable({
  loader,
  loading,
});

