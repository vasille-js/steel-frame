import {
    laptop,
    mobile,
    page,
    prefersDark,
    prefersLight,
    styleSheet,
    tablet,
    setLaptopMaxWidth,
    setMobileMaxWidth,
    setTabletMaxWidth,
    beforeMount,
} from "steel-frame";

export default page(async () => {
    function getClassName() {
        return "test";
    }

    beforeMount(() => {
        setMobileMaxWidth(200);
        setTabletMaxWidth(400);
        setLaptopMaxWidth(800);
    });

    <div class={[styles.div, getClassName()]}>Styled</div>;
});

const styles = styleSheet({
    div: {
        width: ["100%", laptop("90%"), tablet("75%"), mobile("50%")],
        color: ["red", prefersDark("blue"), prefersLight("green")],
    },
});
