import { JavaScriptTextSplitter } from "./text-splitter/JavaScriptTextSplitter.ts";

/**
 * Use case: Split code into Documents

 * How to use a custom TextSplitter to split TypeScript code 
 * into smaller chunks and convert them into Documents. 
 */
export async function run() {
	// Example TypeScript code saved into a template literal
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

	// Custom TextSplitter that can split code into smaller chunks
	const splitter = new JavaScriptTextSplitter({
		// Split the code into chunks of 1000 characters length
		chunkSize: 1000,
		// Amount of characters to overlap each code, in this case
		// 0 = no overlap
		// I did this because each chunk contains all the code
		// and overlaps are not needed
		chunkOverlap: 0,
	});

	// Split the "code" (also called "Document")
	// into chunks using the "splitter" and convert them into
	// Documents (meaning the have "metadata" and "pageContent" afterwards)
	const output = await splitter.createDocuments([code]);

	console.log(output);
}
