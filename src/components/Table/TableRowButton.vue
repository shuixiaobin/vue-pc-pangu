<script>
import { Button } from 'element-ui';
export default {
  functional: true,
  render: function (createElement, { data, children }) {
    return createElement(
      Button,
      {
        ...data,
        props: {
          type: 'text',
          size: 'small',
          ...data.props,
        },
      },
      children
    );
  },
};
</script>
