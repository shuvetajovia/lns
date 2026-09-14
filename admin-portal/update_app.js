const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf-8');

if (!code.includes('magicVariants')) {
    const magicVariantsCode = 
const magicVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
        opacity: 1, 
        scale: 1, 
        transition: { type: 'spring', damping: 20, stiffness: 100, staggerChildren: 0.1 } 
    },
    exit: { opacity: 0, scale: 0.95 }
};
const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring' } }
};
;

    code = code.replace("const App = () => {", magicVariantsCode + "\nconst App = () => {");
    
    // Animate loader
    code = code.replace(
        "if (isLoading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Heritage Dashboard...</div>;",
        if (isLoading) return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360], borderRadius: ["20%", "50%", "20%"] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '60px', height: '60px', background: 'var(--brand-green)', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(10, 61, 46, 0.4)' }} />
                <motion.h3 animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ color: 'var(--brand-green)' }}>Initializing Magic Engine...</motion.h3>
            </motion.div>
        );
    );

    // Make dashboards motion divs
    code = code.replace(/<div className="admin-view">/g, '<motion.div className="admin-view" variants={magicVariants} initial="initial" animate="animate" exit="exit">');
    code = code.replace(/<\/div>\n    \);\n\n    const renderOrders/g, '</motion.div>\n    );\n\n    const renderOrders');
    code = code.replace(/<\/div>\n    \);\n\n    const renderProducts/g, '</motion.div>\n    );\n\n    const renderProducts');
    code = code.replace(/<\/div>\n    \);\n\n    const renderAreas/g, '</motion.div>\n    );\n\n    const renderAreas');
    code = code.replace(/<\/div>\n    \);\n\n    const renderReviews/g, '</motion.div>\n    );\n\n    const renderReviews');
    code = code.replace(/<\/div>\n    \);\n\n    return/g, '</motion.div>\n    );\n\n    return');

    // Make stats grid animated
    code = code.replace(/<div className="stats-grid">/g, '<motion.div className="stats-grid" variants={magicVariants}>');
    code = code.replace(/<div className="stat-card">/g, '<motion.div className="stat-card" variants={itemVariants} whileHover={{ scale: 1.05, y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }} whileTap={{ scale: 0.95 }}>');
    code = code.replace(/<\/div>\n                <\/div>\n                <div style={{ display: 'grid'/g, '</motion.div>\n                </motion.div>\n                <div style={{ display: \'grid\'');

    // Add AnimatePresence mode wait to the tab container
    code = code.replace(/<div className="admin-scroll-content">/g, '<div className="admin-scroll-content">\\n                    <AnimatePresence mode="wait">');
    code = code.replace(/{activeTab === 'reviews' && renderReviews\(\)}\n                <\/div>/g, "{activeTab === 'reviews' && renderReviews()}\n                    </AnimatePresence>\n                </div>");

    fs.writeFileSync('src/App.jsx', code);
    console.log("Magic Animations Injected!");
} else {
    console.log("Already injected.");
}
