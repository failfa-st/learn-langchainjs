<h1 align="center"><big>learn langchainjs</big></h1>

<p align="center"><img src="assets/logo.png" alt="learn langchainjs logo" width="200"/></p>

> LangChain for JavaScript / TypeScript developers.

---

<!-- toc -->

- [Motivation](#motivation)
- [What is LangChain?](#what-is-langchain)
- [Getting started](#getting-started)
  - [Ask a question](#ask-a-question)
- [CLI](#cli)
  - [Ask a question](#ask-a-question-1)
  - [Examples](#examples)
  - [Update VectorStore](#update-vectorstore)
  - [Exit](#exit)

<!-- tocstop -->

## Motivation

I created some projects using the OpenAI API for GPT directly and wanted to step up my game with a
library that is used by many others and this is when I found LangChain. When I was exploring how to
get started with LangChain, I mostly found resources for the Python version of LangChain. As I'm a
JavaScript / TypeScript developer with no deep experience in Python (I can read and understand it,
but have not created many projects with it), those examples were not useful to me. Some of these
examples were also not transferable 1:1 into langchainjs, as both versions don't have the same
features.

When trying to get my head around the [documentation](https://js.langchain.com/docs/), the
[repository](https://github.com/hwchase17/langchainjs) and articles related to LangChain, I had a
hard time understanding how to do the most "basic" things. What is the purpose of all these
different building blocks that LangChain provides? The official search in the
[documentation](https://js.langchain.com/docs/) is using some kind of ChatGPT-style bot, but the
information there was super outdated when I was using it (April - May 2023). I was very disappointed
in that because I was expecting this bot to answer all my questions. Since ChatGPT got released I
got so used to custom explanations about any topic, but as LangChain was released after September
2021, its data is not part of ChatGPT.

I had a goal: Write a ChatBot using langchainjs, that knows everything about langchainjs, so that I
can ask questions about langchainjs. This is when I decided to start from scratch, coding one simple
example at a time, commenting as much as possible and finding use cases for everything I coded.
While reflecting on each example, I tried to make them as easy to understand as possible. In a way,
I can explain each line of code to anyone that wants to understand it as well.

The result is the content of this repository and I hope you can take the bits that make sense to you
in your journey to learn langchainjs.

## What is LangChain?

LangChain is a framework for developing applications powered by language models. It enables
applications to be data-aware, connecting language models to other data sources, and agentic,
allowing language models to interact with their environment. LangChain provides tools for
integration with your API or backend server. It's ideal for building applications that leverage
language models for tasks like tabular question answering, summarization, and API interactions.

Check it out:

- [langchainjs documentation](https://js.langchain.com/docs/)
- [langchainjs repository](https://github.com/hwchase17/langchainjs)

## Getting started

1. Clone the repository to your computer and go inside the learn-langchainjs folder
2. Install the dependencies: `npm i`
3. Copy the `.env.example` and create a `.env` file
   1. Add your `OPENAI_API_KEY`
   2. (optional) Change the `OPENAPI_GPT_MODEL` to `gpt-4` if you don't want to use the default
      `gpt-3.5-turbo`
4. Start the interactive CLI app: `npm start`

> ℹ️ If you have access to `gpt-4`, then you should use it, as the context size is bigger (8k tokens
> vs 4k), which allows you to ask questions with a lot of content (for example adding code and
> asking for improving it).

### Ask a question

The CLI app can answer questions related to langchainjs, as we use augmented retrieval. This means
that when you ask a question, we find the relevant data from the langchainjs repo and provide this
as the context alongside your question when interacting with the OPENAI API.

The CLI app provides a ChatGPT-style bot, which uses the actual data from the lanchainjs-repo as the
context

Useful if you want to interact with a ChatGPT-style bot to learn everything about langchainjs or
have a specific question on how a building block is working or have a bug in your code and need it
to get fixed.

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
