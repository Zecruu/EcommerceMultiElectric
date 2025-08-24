import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@multielectric.com',
      passwordHash: adminPassword,
      role: 'admin'
    });

    // Create employee user
    const employeePassword = await bcrypt.hash('employee123', 12);
    const employee = await User.create({
      name: 'Empleado',
      email: 'empleado@multielectric.com',
      passwordHash: employeePassword,
      role: 'employee'
    });

    // Create customer user
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customer = await User.create({
      name: 'Cliente Demo',
      email: 'cliente@example.com',
      passwordHash: customerPassword,
      role: 'customer',
      phone: '+1-555-0123'
    });

    console.log('Created users');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Cables',
        slug: 'cables',
        description: 'Cables eléctricos de diferentes calibres y tipos',
        active: true,
        sortOrder: 1
      },
      {
        name: 'Interruptores',
        slug: 'interruptores',
        description: 'Interruptores y tomacorrientes',
        active: true,
        sortOrder: 2
      },
      {
        name: 'Iluminación',
        slug: 'iluminacion',
        description: 'Bombillas, luminarias y accesorios de iluminación',
        active: true,
        sortOrder: 3
      },
      {
        name: 'Herramientas',
        slug: 'herramientas',
        description: 'Herramientas eléctricas y de instalación',
        active: true,
        sortOrder: 4
      },
      {
        name: 'Conduit',
        slug: 'conduit',
        description: 'Tubería conduit y accesorios',
        active: true,
        sortOrder: 5
      }
    ]);

    console.log('Created categories');

    // Create products
    const products = await Product.create([
      // Cables
      {
        sku: 'CBL-12AWG-100',
        name: 'Cable THHN 12 AWG - 100 pies',
        description: 'Cable conductor de cobre sólido THHN 12 AWG, ideal para instalaciones residenciales y comerciales.',
        price: 45.99,
        compareAtPrice: 52.99,
        stock: 50,
        images: ['/images/cable-12awg.jpg'],
        categoryIds: [categories[0]._id],
        specifications: {
          'Calibre': '12 AWG',
          'Material': 'Cobre',
          'Tipo': 'THHN',
          'Longitud': '100 pies'
        },
        hot: true,
        active: true,
        featured: true,
        brand: 'Southwire'
      },
      {
        sku: 'CBL-14AWG-100',
        name: 'Cable THHN 14 AWG - 100 pies',
        description: 'Cable conductor de cobre sólido THHN 14 AWG para circuitos de iluminación.',
        price: 32.99,
        stock: 75,
        images: ['/images/cable-14awg.jpg'],
        categoryIds: [categories[0]._id],
        specifications: {
          'Calibre': '14 AWG',
          'Material': 'Cobre',
          'Tipo': 'THHN',
          'Longitud': '100 pies'
        },
        active: true,
        brand: 'Southwire'
      },
      {
        sku: 'CBL-ROMEX-250',
        name: 'Cable Romex 12-2 - 250 pies',
        description: 'Cable Romex 12-2 con tierra para instalaciones residenciales.',
        price: 89.99,
        stock: 25,
        images: ['/images/romex-12-2.jpg'],
        categoryIds: [categories[0]._id],
        specifications: {
          'Tipo': 'Romex 12-2',
          'Con tierra': 'Sí',
          'Longitud': '250 pies'
        },
        active: true,
        featured: true,
        brand: 'Southwire'
      },

      // Interruptores
      {
        sku: 'INT-SIMPLE-WHT',
        name: 'Interruptor Simple Blanco',
        description: 'Interruptor simple de 15A, 120V, color blanco.',
        price: 2.99,
        stock: 200,
        images: ['/images/interruptor-simple.jpg'],
        categoryIds: [categories[1]._id],
        specifications: {
          'Amperaje': '15A',
          'Voltaje': '120V',
          'Color': 'Blanco',
          'Tipo': 'Simple'
        },
        active: true,
        brand: 'Leviton'
      },
      {
        sku: 'INT-DOBLE-WHT',
        name: 'Interruptor Doble Blanco',
        description: 'Interruptor doble de 15A, 120V, color blanco.',
        price: 4.99,
        stock: 150,
        images: ['/images/interruptor-doble.jpg'],
        categoryIds: [categories[1]._id],
        specifications: {
          'Amperaje': '15A',
          'Voltaje': '120V',
          'Color': 'Blanco',
          'Tipo': 'Doble'
        },
        active: true,
        brand: 'Leviton'
      },
      {
        sku: 'TOM-DUPLEX-WHT',
        name: 'Tomacorriente Dúplex Blanco',
        description: 'Tomacorriente dúplex de 15A, 125V con conexión a tierra.',
        price: 3.49,
        stock: 180,
        images: ['/images/tomacorriente-duplex.jpg'],
        categoryIds: [categories[1]._id],
        specifications: {
          'Amperaje': '15A',
          'Voltaje': '125V',
          'Color': 'Blanco',
          'Con tierra': 'Sí'
        },
        hot: true,
        active: true,
        brand: 'Leviton'
      },

      // Iluminación
      {
        sku: 'LED-A19-9W',
        name: 'Bombilla LED A19 9W',
        description: 'Bombilla LED A19 de 9W, equivalente a 60W incandescente, luz blanca cálida.',
        price: 7.99,
        compareAtPrice: 9.99,
        stock: 120,
        images: ['/images/led-a19.jpg'],
        categoryIds: [categories[2]._id],
        specifications: {
          'Potencia': '9W',
          'Equivalencia': '60W',
          'Temperatura': '2700K',
          'Base': 'E26'
        },
        active: true,
        featured: true,
        brand: 'Philips'
      },
      {
        sku: 'LED-BR30-12W',
        name: 'Bombilla LED BR30 12W',
        description: 'Bombilla LED BR30 de 12W para empotrados, luz blanca fría.',
        price: 12.99,
        stock: 80,
        images: ['/images/led-br30.jpg'],
        categoryIds: [categories[2]._id],
        specifications: {
          'Potencia': '12W',
          'Equivalencia': '75W',
          'Temperatura': '5000K',
          'Base': 'E26'
        },
        active: true,
        brand: 'Philips'
      },

      // Herramientas
      {
        sku: 'HER-MULT-DIG',
        name: 'Multímetro Digital',
        description: 'Multímetro digital con pantalla LCD, medición de voltaje AC/DC, corriente y resistencia.',
        price: 24.99,
        stock: 35,
        images: ['/images/multimetro.jpg'],
        categoryIds: [categories[3]._id],
        specifications: {
          'Tipo': 'Digital',
          'Pantalla': 'LCD',
          'Mediciones': 'V, A, Ω'
        },
        active: true,
        brand: 'Klein Tools'
      },
      {
        sku: 'HER-PELA-CAB',
        name: 'Pelacables Automático',
        description: 'Pelacables automático para cables de 10-24 AWG.',
        price: 18.99,
        stock: 45,
        images: ['/images/pelacables.jpg'],
        categoryIds: [categories[3]._id],
        specifications: {
          'Rango': '10-24 AWG',
          'Tipo': 'Automático'
        },
        hot: true,
        active: true,
        brand: 'Klein Tools'
      },

      // Conduit
      {
        sku: 'CON-PVC-1/2',
        name: 'Conduit PVC 1/2" x 10 pies',
        description: 'Tubería conduit PVC de 1/2 pulgada, 10 pies de longitud.',
        price: 3.99,
        stock: 100,
        images: ['/images/conduit-pvc.jpg'],
        categoryIds: [categories[4]._id],
        specifications: {
          'Diámetro': '1/2"',
          'Material': 'PVC',
          'Longitud': '10 pies'
        },
        active: true,
        brand: 'Cantex'
      },
      {
        sku: 'CON-EMT-3/4',
        name: 'Conduit EMT 3/4" x 10 pies',
        description: 'Tubería conduit EMT de 3/4 pulgada, 10 pies de longitud.',
        price: 8.99,
        stock: 60,
        images: ['/images/conduit-emt.jpg'],
        categoryIds: [categories[4]._id],
        specifications: {
          'Diámetro': '3/4"',
          'Material': 'EMT',
          'Longitud': '10 pies'
        },
        active: true,
        brand: 'Allied Tube'
      }
    ]);

    console.log('Created products');

    console.log('\n=== SEED DATA COMPLETED ===');
    console.log('Users created:');
    console.log(`Admin: admin@multielectric.com / admin123`);
    console.log(`Employee: empleado@multielectric.com / employee123`);
    console.log(`Customer: cliente@example.com / customer123`);
    console.log('\nCategories:', categories.length);
    console.log('Products:', products.length);

    process.exit(0);

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
