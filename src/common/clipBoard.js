import Clipboard from 'clipboard'
import { Message } from 'element-ui'

const clipboard = new Clipboard('.static-clipboard')

clipboard.on('success', function() {
  Message.success('链接已复制')
});

clipboard.on('error', function(e) {
  Message.error(e.action + '-' + e.trigger)
});
