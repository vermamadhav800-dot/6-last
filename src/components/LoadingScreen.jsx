
import AppLogo from './AppLogo';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-sm">
            <AppLogo isAnimated={true} />
        </div>
    );
};

export default LoadingScreen;
