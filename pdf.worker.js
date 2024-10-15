self.onmessage = function (event) {
    const { action, data } = event.data;
    if (action === 'getDocument') {
      postMessage({ action: 'workerLoaded' });
    }
  };