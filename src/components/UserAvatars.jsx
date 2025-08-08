import PropTypes from 'prop-types';

const UserAvatars = ({ users }) => {
  return (
    <ul className="flex">
      {users.map((user, index) => (
        <li className={index === 0 ? "" : "-ml-[4%]"} key={user.id}>
          <img
            className="bg-[#D3B3FF] h-5 w-5 md:h-6 md:w-6 rounded-full"
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


