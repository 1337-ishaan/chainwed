import * as React from 'react';
import { state } from 'state';

import { getProvider } from 'utils/getProvider';

const Phantom = (): null => {
  const provider = getProvider();

  React.useEffect(() => {}, [provider]);

  return null;
};

export default Phantom;
