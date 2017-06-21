import React from 'react';

export default ({ isLoading, text, loadingText, disabled = false, ...props }) => (
  <button disabled={disabled || isLoading} {...props}>
    {!isLoading ? text : loadingText}
  </button>
);
