'use strict';

var Elasticsearch = require('elasticsearch'),
  _ = require('lodash'),
  client = new Elasticsearch.Client({
    host: process.env.ES_HOST,
    log: 'trace'
  });

module.exports.handler = function(event, context) {
  var names = []
  client.search({
    index: 'ldgourmet',
    type: 'restaurant',
    body: {
      query: {
        match: {
          name: event.word
        }
      },
      sort : [{ "access_count" : {"order" : "desc", "missing" : "_last"}}],
    },
    defaultOperator: 'AND'
  }).then(function (resp) {
    var hits = resp.hits.hits;
    _(hits).each(function(v) {
      names.push(v._source.name)
    });

    return context.done(null, {
      names: _.uniq(names)
    });
  }, function (err) {
    console.trace(err.message);
  });
};
