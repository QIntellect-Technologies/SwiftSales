try {
    const hnswlib = require('hnswlib-node');
    console.log('✅ hnswlib-node loaded successfully');

    const dim = 384;
    const maxElements = 10;
    const index = new hnswlib.HierarchicalNSW('l2', dim);
    index.initIndex(maxElements);

    console.log('✅ Index initialized');

    const point = new Array(dim).fill(0.1);
    index.addPoint(point, 0);

    console.log('✅ Point added');
    console.log('🎉 Standard test passed!');
} catch (error) {
    console.error('❌ Error testing hnswlib-node:', error);
    process.exit(1);
}
