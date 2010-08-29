var capi = require('./binding'),
    sys  = require('sys');

var MDNSService = require('./mdns_service').MDNSService;

function Resolver(name, regtype, domain, options, callback) {
  MDNSService.call(this);
  var self = this;

  if ( ! callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
  }
  options = options || {};

  var flags    = options.flags          || 0,
      ifaceIdx = options.interfaceIndex || 0,
      context  = options.context        || null;

  self.callback = callback

  capi.DNSServiceResolve(self.serviceRef, flags, ifaceIdx, name, regtype,
      domain, self._onResolve, context);
}

sys.inherits(Resolver, MDNSService);
exports.Resolver = Resolver;

Resolver.prototype._onResolve = function(sdRef, flags, interfaceIndex,
    errorCode, fullname, hosttarget, port, txtRecord, context)
{
  var error = capi.buildException(errorCode);
  var info = {
    interfaceIndex: interfaceIndex,
    fullname: fullname,
    hosttarget: hosttarget,
    port: port,
    txtRecord: txtRecord,
    context: context
  };
  this.callback(error, info, flags);
}