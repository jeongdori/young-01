import { useQuery } from '@/lib/QueryClient';

// util
import userService from '../services';

// components

const UserListPage = () => {
    // ──────────────────────────────────────────────────────────────
    // constants

    // ──────────────────────────────────────────────────────────────
    // hook form
    const { data } = useQuery({
        queryKey: ['user', 'findAll'],
        queryFn: userService.findAll,
        retry: false,
    });

    // ──────────────────────────────────────────────────────────────
    // Derived Values

    // ──────────────────────────────────────────────────────────────
    // helpers

    // ──────────────────────────────────────────────────────────────
    // handler

    // ──────────────────────────────────────────────────────────────
    // routing

    // ──────────────────────────────────────────────────────────────
    // submit/api call

    // ──────────────────────────────────────────────────────────────
    //  Render Guards

    // ──────────────────────────────────────────────────────────────
    // jsx
    return (
        <div>
            <h2>유저 목록</h2>
            <ul>
                {data?.map((user) => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserListPage;
