let authToken;

window.onload = () => {
  document.querySelector('#get-btn').onclick = async () => {
    const roomName = document.querySelector('#room-name-text').value;
    const memberName = document.querySelector('#member-name-text').value;

    // POST request to auth server.
    const response = await fetch('http://localhost:8080/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionToken: '4CXS0f19nvMJBYK05o3toTWtZF5Lfd2t6Ikr2lID',
        roomName: roomName,
        memberName: memberName
      })
    });

    if (response.ok) {
      const credential = await response.json();
      console.log(credential);
      authToken = credential.authToken;
      document.querySelector('#result').textContent = JSON.stringify(credential, null, 2);
      document.querySelector('#get-btn').textContent = 'Done!';
    } else {
      alert('Request failed: ' + response.statusText);
    }
  };

  document.querySelector('#copy-btn').onclick = async () => {
    await navigator.clipboard.writeText(authToken);
    document.querySelector('#copy-btn').textContent = 'Copied!';
  };
};
