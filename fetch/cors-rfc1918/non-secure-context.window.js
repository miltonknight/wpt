// META: script=resources/support.js
//
// Spec: https://wicg.github.io/cors-rfc1918/#integration-fetch
//
// This file covers only those tests that must execute in a non secure context.
// Other tests are defined in: secure-context.any.js

setup(() => {
  // No sense running tests if `document.addressSpace` is not implemented.
  assert_implements(document.addressSpace);
  assert_implements_optional(document.addressSpace == "local");

  assert_false(window.isSecureContext);
});

// For the following tests, we go through an iframe, because it is not possible
// to directly import the test harness from a secured public page.

promise_test(t => {
    // Register an event listener that will resolve this promise when this window
    // receives a message posted to it.
    const event_received = new Promise(resolve => {
      window.addEventListener("message", resolve);
    });
    return append_child_frame(t, document, "resources/treat-as-public-address.html")
        .then(() => {
            var iframe = document.getElementsByTagName('iframe')[0].contentWindow;
            iframe.postMessage("local", "*");
            return event_received;
        }).then(event => {assert_equals(event.data, 'failure')});
}, "Public non secure page fetches local page.");

promise_test(t => {
    // Register an event listener that will resolve this promise when this window
    // receives a message posted to it.
    const event_received = new Promise(resolve => {
      window.addEventListener("message", resolve);
    });
    return append_child_frame(t, document, "resources/treat-as-public-address.html")
        .then(() => {
            var iframe = document.getElementsByTagName('iframe')[0].contentWindow;
            iframe.postMessage("public-non-secure", "*");
            return event_received;
        }).then(event => {assert_equals(event.data, 'success')});
}, "Public non secure page fetches public non secure page.");

promise_test(t => {
    // Register an event listener that will resolve this promise when this window
    // receives a message posted to it.
    const event_received = new Promise(resolve => {
      window.addEventListener("message", resolve);
    });
    return append_child_frame(t, document, "resources/treat-as-public-address.html")
        .then(() => {
            var iframe = document.getElementsByTagName('iframe')[0].contentWindow;
            iframe.postMessage("public-secure", "*");
            return event_received;
        }).then(event => {assert_equals(event.data, 'success')});
}, "Public non secure page fetches public secure page.");

