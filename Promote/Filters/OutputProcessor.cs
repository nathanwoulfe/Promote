﻿using System;
using System.IO;
using System.Text;
using System.Web.Mvc;

namespace Promote.Filters
{
    /// <summary>Processes the output of an action before it is transmitted to the client.</summary>
    public abstract class OutputProcessorActionFilterAttribute : ActionFilterAttribute
    {
        /// <summary>Initializes a new instance of the <see cref="OutputProcessorActionFilterAttribute"/> class.</summary>
        protected OutputProcessorActionFilterAttribute()
        {
            InputEncoding = Encoding.UTF8;
            OutputEncoding = Encoding.UTF8;
        }

        /// <summary>Gets or sets the input encoding.</summary>
        private Encoding InputEncoding { get; }

        /// <summary>Gets or sets the output encoding.</summary>
        private Encoding OutputEncoding { get; }

        /// <summary>Processes the output data.</summary>
        /// <param name="data">The data.</param>
        /// <returns>The processed data.</returns>
        protected abstract string Process(string data);

        public override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            var response = filterContext.HttpContext.Response;
            response.Filter = new OutputProcessorStream(response.Filter, InputEncoding, OutputEncoding, Process);
        }

        private class OutputProcessorStream : Stream
        {
            private readonly StringBuilder _data = new StringBuilder();

            private readonly Stream _stream;
            private readonly Func<string, string> _processor;

            private readonly Encoding _inputEncoding;
            private readonly Encoding _outputEncoding;

            public OutputProcessorStream(Stream stream, Encoding inputEncoding, Encoding outputEncoding, Func<string, string> processor)
            {
                _stream = stream;
                _processor = processor;
                _inputEncoding = inputEncoding;
                _outputEncoding = outputEncoding;
            }

            public override void Write(byte[] buffer, int offset, int count)
            {
                _data.Append(_inputEncoding.GetString(buffer, offset, count));
            }

            /// <exception cref="IOException">An I/O error has occurred.</exception>
            /// <exception cref="Exception">A delegate callback throws an exception.</exception>
            public override void Close()
            {
                var output = _outputEncoding.GetBytes(_processor(_data.ToString()));
                _stream.Write(output, 0, output.Length);
                _stream.Flush();
                _data.Clear();
            }

            public override void Flush()
            {
            }

            /// <exception cref="IOException">An I/O error occurs. </exception>
            public override int Read(byte[] buffer, int offset, int count)
            {
                return _stream.Read(buffer, offset, count);
            }

            /// <exception cref="IOException">An I/O error occurs. </exception>
            public override long Seek(long offset, SeekOrigin origin)
            {
                return _stream.Seek(offset, origin);
            }

            /// <exception cref="IOException">An I/O error occurs. </exception>
            public override void SetLength(long value)
            {
                _stream.SetLength(value);
            }

            public override bool CanRead => true;
            public override bool CanSeek => true;
            public override bool CanWrite => true;
            public override long Length => 0;

            public override long Position { get; set; }
        }
    }
}
