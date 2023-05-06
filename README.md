<h1 align="center"><big>learn langchainjs</big></h1>

> A series of examples to understand how to use langchainjs.

<!-- toc -->

- [What is langchainjs?](#what-is-langchainjs)
- [How to use this guide?](#how-to-use-this-guide)
- [CLI](#cli)
  * [Ask a question](#ask-a-question)
  * [Examples](#examples)
  * [Update VectorStore](#update-vectorstore)
  * [Exit](#exit)

<!-- tocstop -->

## What is langchainjs?

LangChain is a framework for developing applications powered by language models. It enables
applications to be data-aware, connecting language models to other data sources, and agentic,
allowing language models to interact with their environment. LangChain provides tools for
integration with your API or backend server. It's ideal for building applications that leverage
language models for tasks like tabular question answering, summarization, and API interactions.

Check it out:

- [langchainjs documentation](https://js.langchain.com/docs/)
- [langchainjs repository](https://github.com/hwchase17/langchainjs)

## How to use this guide?

1.  Clone the repository to your computer
2.  Install dependencies: `npm i`
3.  Use the interactive CLI app: `npm start`

        { name: "Ask a question", value: "query" },
        { name: "Examples", value: "examples" },
        { name: "Update VectorStore", value: "update" },
        { name: "Exit", value: "exit" },

## CLI

### Ask a question

Opens your default text editor, allowing you to compose a multi-line question. After typing your
question, save and close the file. The content of the file will be used as your input question.

Under the hood, we employ Retrieval Augmented Generation (RAG) to provide you with the most relevant
information. To achieve this, we've stored portions of the original langchainjs repository in a
local [vectorStore](/data/vectorStores/langchainjs-repo/).

When you ask a question, the CLI application performs a similarity search against the local
[vectorStore](/data/vectorStores/langchainjs-repo/). It then selects the most similar documents and
uses them as the context for the SystemMessage when interacting with OpenAI GPT.

As a result, you receive an answer based on the latest information from the langchainjs repository,
ensuring an up-to-date and accurate response.

The result is an answer based on the latest information of langchainjs.

### Examples

Allows you to explore and run various code examples from the [/src/examples](/src/examples/)
directory within the CLI. When you choose this action, you will be presented with a list of
available examples, dynamically generated based on the files in the [/src/examples](/src/examples/)
directory.

To run an example, simply select it from the list. The CLI application will execute the chosen
example, displaying any output or results in the terminal. After running the example, you will be
returned to the list of available examples, allowing you to choose another one or return to the main
menu.

This feature provides a convenient way to learn about and experiment with different aspects of the
langchainjs library. It also showcases the capabilities of the library through practical, hands-on
examples.

### Update VectorStore

Responsible for filling up the local [vectorStore](/data/vectorStores/langchainjs-repo/) with data.
When you choose this action, the CLI application will start the updating process.

During the update, the latest information from the langchainjs repository is fetched, and the data
is transformed into a format suitable for the [vectorStore](/data/vectorStores/langchainjs-repo/).
Once the update is complete, the CLI application will display a message to inform you that the
process has successfully finished.

By updating the [vectorStore](/data/vectorStores/langchainjs-repo/), you ensure that the information
used for answering questions is up-to-date and relevant. This action plays a crucial role in
maintaining the accuracy and usefulness of the answers provided by the Retrieval Augmented
Generation (RAG) system in the "Ask a Question" action.

### Exit

Terminate the CLI application.

You can also use CTRL+C to exit.
