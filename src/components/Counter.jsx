import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button className="hover:bg-red-600 transition" onClick={() => setCount(count + 1)}>
            Clicked {count} times
        </button>
    );
}

export default Counter;