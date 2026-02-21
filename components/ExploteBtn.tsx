'use client';

import Image from "next/image";
import posthog from "posthog-js";

const ExploteBtn = () => {
    const handleClick = () => {
        posthog.capture('explore_events_clicked');
    };

    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={handleClick}>
            <a href="#events">
                Explore Events
                <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={20} />
            </a>
        </button>
    )
}
export default ExploteBtn
