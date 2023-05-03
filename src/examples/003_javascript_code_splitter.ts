import { JavaScriptTextSplitter } from "./text-splitter/JavaScriptTextSplitter.ts";

export async function run() {
	const code = `import { NextApiRequest, NextApiResponse } from 'next';
	import { PrismaClient } from '@prisma/client';
	
	const prisma = new PrismaClient();
	
	export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	  switch (req.method) {
		case 'POST':
		  try {
			const { productId, quantity } = req.body;
			const product = await prisma.product.findUnique({
			  where: {
				id: productId,
			  },
			});
			if (!product) {
			  res.status(400).json({ message: 'Invalid product ID' });
			  return;
			}
			const cartItem = await prisma.cartItem.create({
			  data: {
				product: {
				  connect: {
					id: productId,
				  },
				},
				quantity,
			  },
			});
			res.status(201).json({ message: 'Product added to the cart successfully' });
		  } catch (error) {
			console.error(error);
			res.status(400).json({ message: 'Invalid input, product not added to the cart' });
		  }
		  break;
		default:
		  res.status(405).json({ message: 'Method not allowed' });
		  break;
	  }
	}

	export async function productId(req: NextApiRequest, res: NextApiResponse) {
		const { id } = req.query;
	  
		switch (req.method) {
		  case 'GET':
			try {
			  const product = await prisma.product.findUnique({
				where: { id: Number(id) },
				select: {
				  name: true,
				  description: true,
				  specifications: true,
				  price: true,
				  availability: true,
				},
			  });
	  
			  if (!product) {
				res.status(404).json({ message: 'Product not found' });
			  } else {
				res.status(200).json(product);
			  }
			} catch (error) {
			  console.error(error);
			  res.status(500).json({ message: 'Internal server error' });
			}
			break;
		  default:
			res.status(405).json({ message: 'Method not allowed' });
			break;
		}
	  }
	`;

	const splitter = new JavaScriptTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 0,
	});

	const output = await splitter.createDocuments([code]);

	console.log(output);
}
