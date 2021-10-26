import { notification, message } from 'antd';
const debug = require('debug')('api');

export const API_URL = process.env.REACT_APP_API_URL || '';

debug('API_URL', API_URL);

function json_req(url, {method='POST', data=null, okMsg=null}, cb) {
  let body = JSON.stringify(data);
  fetch(`${API_URL}${url}`, {
    method: method,
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: body,
  })
    .then(res => {
      return res.json()
    })
    .then(data => {
      debug('resp json', data);
      if (data.error) {
        debug('AJAX ERROR', url, body, data);
        notification.error({
          message: data.error,
          // description: ,
        });
        cb(data.error, data.data);
      } else {
        debug('AJAX RECEIVED', url, body, data);
        if (okMsg) message.success(okMsg);
        cb(null, data.data);
      }
    })
    .catch(function (err) {
      debug('AJAX EXCEPTION', url, body, err);
      notification.error({
          message: err,
          // description: ,
        });
      cb(err, null);
    });
}

export function run_nlp(cb, doc, steps, model='default', config=null) {
  debug('run_nlp', arguments)
  json_req(`/api/nlp`, {data: {data: doc, steps: steps, model: model, config: config}}, cb)
}
