import PropTypes from 'prop-types';

export default {
  classroom: PropTypes.shape({
    name: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    participants: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired
    }))
  }).isRequired
};
