import PropTypes from 'prop-types';

const UserAvatars = ({ users }) => {
  return (
    <ul className="flex">
      {users.map((user, index) => (
        <li className={index === 0 ? "" : "-ml-2"} key={user.id}>
          <img
            className="h-8 w-8 rounded-full border-2 border-[#0899A3] ring-2 ring-white/10 transform hover:-translate-y-1 transition-transform"
            src={user.avatar}
            alt={user.name}
          />
        </li>
      ))}
    </ul>
  );
};

UserAvatars.propTypes = {
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        avatar: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

export default UserAvatars;


