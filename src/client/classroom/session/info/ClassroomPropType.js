import PropTypes from 'prop-types';

export default {
  classroom: PropTypes.shape({
    name: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      username: PropTypes.string.isRequired
    }),
    participants: PropTypes.arrayOf(PropTypes.shape({
      username: PropTypes.string.isRequired
    }))
  }).isRequired
};
