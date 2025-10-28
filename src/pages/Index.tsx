import React from 'react';

const Index = () => {
  const [isPinkMode, setIsPinkMode] = React.useState(false);

  React.useEffect(() => {
    if (isPinkMode) {
      document.documentElement.style.setProperty('--primary', '340 70% 60%');
      document.documentElement.style.setProperty('--primary-glow', '340 85% 75%');
    } else {
      document.documentElement.style.setProperty('--primary', '263 70% 60%');
      document.documentElement.style.setProperty('--primary-glow', '263 85% 75%');
    }
  }, [isPinkMode]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Gradient Glow Background */}
      <div className="absolute inset-0 bg-gradient-glow opacity-60" />
      
      {/* Animated Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/30 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-secondary/20 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <h1 className="mb-6 text-7xl md:text-9xl font-black tracking-tight bg-gradient-primary bg-clip-text text-transparent drop-shadow-2xl">
          Maria Clara
        </h1>
        <p className="mb-4 text-xl md:text-2xl text-foreground/80 font-light tracking-wide">
          Bem-vindo ao futuro
        </p>
        
        {/* Decorative Line */}
        <div className="mt-8 mx-auto h-1 w-32 bg-gradient-primary rounded-full shadow-glow" />
        
        {/* Botão para mudar para rosa */}
        <button
          onClick={() => setIsPinkMode(!isPinkMode)}
          className="mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
        >
          {isPinkMode ? 'Voltar ao roxo' : 'Mudar para rosa'}
        </button>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </main>
  );
};

export default Index;